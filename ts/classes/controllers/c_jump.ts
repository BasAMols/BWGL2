import { TickerReturnData } from '../ticker';
import { v3, Vector3 } from "../util/math/vector3";
import { MovementController, MovementControllerProps } from './c_movement';

export interface JumpControllerProps extends MovementControllerProps {
    // Jump Configuration
    jump?: {
        // Basic Properties
        height?: number;           // Maximum jump height in meters (default: 1.2)
        speed?: number;            // Initial jump velocity (calculated from height if not provided)
        gravity?: number;          // Gravity strength (default: 0.2)
        
        // Variable Height (early release)
        minHeight?: number;        // Minimum guaranteed height in meters (default: 0.4)
        earlyReleaseMultiplier?: number;  // Velocity multiplier when jump released early (default: 0.6)
        
        // Advanced Features (only used if provided)
        maxJumps?: number;         // Number of jumps allowed (default: 1)
        bufferTime?: number;       // ms to buffer jump input before landing (use Infinity for hold-to-bounce)
        coyoteTime?: number;       // ms to allow jump after leaving ground
        cooldown?: number;         // ms cooldown between jumps
        
        // Gravity Modifiers (multipliers of base gravity, default: 1.0)
        ascendingGravity?: number;  // Gravity multiplier while going up
        descendingGravity?: number; // Gravity multiplier while falling
        fastFallMultiplier?: number; // Extra gravity multiplier when holding down
    };
}

/**
 * JumpController extends MovementController with jumping capabilities
 * Supports basic jumping, multi-jumping, coyote time, jump buffering, and gravity modifiers
 */
export abstract class JumpController extends MovementController {
    
    // Jump configuration (using movement system's scaling)
    private jumpConfig = {
        jumpHeight: 1.2,              // Default jump height in meters
        jumpSpeed: 0,                 // Calculated from jumpHeight
        gravity: 0.2,                 // Gravity constant (tuned for movement scaling)
        minJumpHeight: 0.4,           // Default minimum guaranteed height
        earlyReleaseMultiplier: 0.6,  // Default: reduce to 60% when released early
        maxJumps: 1,                  // Single jump by default
        ascendingGravity: 1.0,        // Gravity multiplier going up
        descendingGravity: 1.0,       // Gravity multiplier going down
    };
    
    // Advanced features (only enabled if configured)
    private advancedFeatures = {
        jumpBufferTime: undefined as number | undefined,
        coyoteTime: undefined as number | undefined,
        jumpCooldown: undefined as number | undefined,
        fastFallMultiplier: undefined as number | undefined,
    };
    
    // Jump state
    private jumpState = {
        isGrounded: false,
        jumpsRemaining: 1,
        jumpBufferTimer: 0,
        coyoteTimer: 0,
        jumpCooldownTimer: 0,
        lastGroundedTime: 0,
        verticalVelocity: 0,
        jumpStartTime: 0,
        jumpPressed: false,        // Track if jump was just pressed
        jumpPressedLastFrame: false, // Track previous frame's jump state
        isJumping: false,          // Track if currently in a jump
        minJumpTimeMs: 0,          // Calculated minimum time to guarantee min height
        earlyReleaseApplied: false, // Track if early release has been applied this jump
    };

    constructor(props: JumpControllerProps = {}) {
        super(props);
        
        // Apply jump properties (new nested structure)
        if (props.jump) {
            this.jumpConfig.jumpHeight = props.jump.height ?? this.jumpConfig.jumpHeight;
            this.jumpConfig.gravity = props.jump.gravity ?? this.jumpConfig.gravity;
            this.jumpConfig.minJumpHeight = props.jump.minHeight ?? this.jumpConfig.minJumpHeight;
            this.jumpConfig.earlyReleaseMultiplier = props.jump.earlyReleaseMultiplier ?? this.jumpConfig.earlyReleaseMultiplier;
            this.jumpConfig.maxJumps = props.jump.maxJumps ?? this.jumpConfig.maxJumps;
            this.jumpConfig.ascendingGravity = props.jump.ascendingGravity ?? this.jumpConfig.ascendingGravity;
            this.jumpConfig.descendingGravity = props.jump.descendingGravity ?? this.jumpConfig.descendingGravity;
            
            // Advanced features (only if provided)
            this.advancedFeatures.jumpBufferTime = props.jump.bufferTime;
            this.advancedFeatures.coyoteTime = props.jump.coyoteTime;
            this.advancedFeatures.jumpCooldown = props.jump.cooldown;
            this.advancedFeatures.fastFallMultiplier = props.jump.fastFallMultiplier;
            
            // Calculate jump speed from height if not provided
            this.jumpConfig.jumpSpeed = props.jump.speed ?? this.calculateJumpSpeed(this.jumpConfig.jumpHeight);
        }
        
        // Calculate default jump speed if no jump config was provided
        if (this.jumpConfig.jumpSpeed === 0) {
            this.jumpConfig.jumpSpeed = this.calculateJumpSpeed(this.jumpConfig.jumpHeight);
        }
        
        // Initialize jump state
        this.jumpState.jumpsRemaining = this.jumpConfig.maxJumps;
    }
    
    private getJumpDirectionVector(): Vector3 {
        // Get the direction for jump based on inputMapping.up
        return this.mapAxisToVector(this.inputMapping.up, 1);
    }
    
    private calculateJumpSpeed(height: number): number {
        // Use the same physics formula but with our gravity constant
        const jumpSpeed = Math.sqrt(2 * this.jumpConfig.gravity * height);
        
        // Jump speed calculation complete
        return jumpSpeed;
    }
    
    protected abstract getJumpInput(): boolean;
    
    protected getFastFallInput(): boolean {
        return false; // can be overridden in subclass
    }
    
    tick(obj: TickerReturnData) {
        // Update horizontal movement first
        super.tick(obj);
        
        const frameTime = obj.intervalS10 / 1000; // Convert to seconds
        const jumpPressed = this.getJumpInput();
        const fastFallPressed = this.getFastFallInput();
        
        // Update timers
        this.updateTimers(frameTime);
        
        // Ground detection (simple Y position check for now)
        const currentY = this.actor.transform.getLocalPosition().y;
        const wasGrounded = this.jumpState.isGrounded;
        this.jumpState.isGrounded = currentY <= 0;
        
        // Handle landing
        if (!wasGrounded && this.jumpState.isGrounded) {
            this.onLanding();
        }
        
        // Handle coyote time
        if (!this.jumpState.isGrounded && wasGrounded && this.advancedFeatures.coyoteTime !== undefined) {
            this.jumpState.coyoteTimer = this.advancedFeatures.coyoteTime;
        }
        
        // Jump input handling - execute immediately on button press
        this.handleJumpInput(jumpPressed);
        
        // Apply gravity and vertical movement
        this.updateVerticalMovement(fastFallPressed, obj);
        
        // Apply vertical position change (using same scaling as horizontal movement)
        const scaling = obj.intervalS10 / 120;
        const verticalMovement = this.jumpState.verticalVelocity * scaling;
        const currentPosition = this.actor.transform.getLocalPosition();
        
        // Vertical movement applied
        
        this.actor.transform.setPosition(v3(currentPosition.x, currentPosition.y + verticalMovement, currentPosition.z));
        
        // Ground clamping
        if (this.actor.transform.getLocalPosition().y < 0) {
            this.actor.transform.setY(0);
            this.jumpState.verticalVelocity = 0;
        }
        
        // Update jump press state for next frame
        this.jumpState.jumpPressedLastFrame = jumpPressed;
    }
    
    private updateTimers(frameTime: number): void {
        const frameMs = frameTime * 1000;
        
        // Check if cooldown was active before update
        const cooldownWasActive = this.jumpState.jumpCooldownTimer > 0;
        
        // Update all timers (but don't reduce infinite jump buffer)
        if (this.jumpState.jumpBufferTimer !== Infinity) {
            this.jumpState.jumpBufferTimer = Math.max(0, this.jumpState.jumpBufferTimer - frameMs);
        }
        this.jumpState.coyoteTimer = Math.max(0, this.jumpState.coyoteTimer - frameMs);
        this.jumpState.jumpCooldownTimer = Math.max(0, this.jumpState.jumpCooldownTimer - frameMs);
        
        // If cooldown just expired and infinite buffer is active, try to jump (but only on ground)
        const cooldownJustExpired = cooldownWasActive && this.jumpState.jumpCooldownTimer <= 0;
        if (cooldownJustExpired && this.jumpState.jumpBufferTimer === Infinity && this.jumpState.isGrounded) {
            this.tryJump();
        }
    }
    
    private handleJumpInput(jumpPressed: boolean): void {
        // Detect jump button press (not held)
        const jumpJustPressed = jumpPressed && !this.jumpState.jumpPressedLastFrame;
        
        // Detect jump button release
        const jumpJustReleased = !jumpPressed && this.jumpState.jumpPressedLastFrame;
        
        if (jumpJustPressed) {
            // Buffer the jump if configured
            if (this.advancedFeatures.jumpBufferTime !== undefined) {
                this.jumpState.jumpBufferTimer = this.advancedFeatures.jumpBufferTime;
            }
            
            // Try to jump immediately
            this.tryJump();
        }
        
        // For infinite jump buffer (hold-to-bounce), maintain buffer while held
        if (jumpPressed && this.advancedFeatures.jumpBufferTime === Infinity) {
            this.jumpState.jumpBufferTimer = Infinity;
        }
        
        // Clear infinite buffer when button is released
        if (jumpJustReleased && this.jumpState.jumpBufferTimer === Infinity) {
            this.jumpState.jumpBufferTimer = 0;
        }
        
        // Handle early jump release for variable height (only once per jump)
        if (jumpJustReleased && this.jumpState.isJumping && this.jumpConfig.minJumpHeight > 0 && !this.jumpState.earlyReleaseApplied) {
            this.handleEarlyRelease();
        }
    }
    
    private tryJump(): void {
        const canJump = this.canJump();
        if (!canJump) return;
        
        // Execute jump with full height (no variable jumping)
        const jumpSpeed = this.calculateJumpSpeed(this.jumpConfig.jumpHeight);
        
        // Apply jump force in the direction specified by inputMapping.up
        const jumpDirection = this.getJumpDirectionVector();
        
        // If the up direction is Y (default), use the traditional vertical velocity system
        if (this.inputMapping.up === '+y' || this.inputMapping.up === '-y') {
            const upMultiplier = this.inputMapping.up === '+y' ? 1 : -1;
            this.jumpState.verticalVelocity = jumpSpeed * upMultiplier;
        } else {
            // For non-Y jump directions, apply impulse to the movement velocity instead
            const jumpVelocity = jumpDirection.scale(jumpSpeed);
            this.movement.currentVelocity = this.movement.currentVelocity.add(jumpVelocity);
        }
        this.jumpState.jumpsRemaining--;
        this.jumpState.jumpStartTime = performance.now();
        this.jumpState.isJumping = true;
        this.jumpState.earlyReleaseApplied = false; // Reset early release state for new jump
        
        // Calculate minimum jump time if minimum height is configured
        if (this.jumpConfig.minJumpHeight > 0) {
            const minJumpSpeed = this.calculateJumpSpeed(this.jumpConfig.minJumpHeight);
            // Calculate how much velocity needs to be lost to reach minimum speed
            const velocityDifference = jumpSpeed - minJumpSpeed;
            // Gravity application per frame: gravity * (intervalS10 / 120)
            // Assuming average of 7ms frame time (144fps)
            const averageFrameTime = 7; // ms
            const gravityPerFrame = this.jumpConfig.gravity * this.jumpConfig.ascendingGravity * (averageFrameTime / 120);
            // Frames needed to lose the velocity difference
            const framesNeeded = velocityDifference / gravityPerFrame;
            this.jumpState.minJumpTimeMs = framesNeeded * averageFrameTime;
        } else {
            this.jumpState.minJumpTimeMs = 0; // No minimum time required
        }
        
        // Jump executed successfully
        
        // Start cooldown if configured
        if (this.advancedFeatures.jumpCooldown !== undefined) {
            this.jumpState.jumpCooldownTimer = this.advancedFeatures.jumpCooldown;
        }
        
        // Clear timers (but preserve infinite jump buffer for hold-to-bounce)
        if (this.jumpState.jumpBufferTimer !== Infinity) {
            this.jumpState.jumpBufferTimer = 0;
        }
        this.jumpState.coyoteTimer = 0;
        
        this.onJumpStart(this.jumpConfig.maxJumps - this.jumpState.jumpsRemaining);
    }
    
    private handleEarlyRelease(): void {
        // Only allow early release if we're moving upward
        if (this.jumpState.verticalVelocity <= 0) return;
        
        const currentY = this.actor.transform.getLocalPosition().y;
        const currentVelocity = this.jumpState.verticalVelocity;
        
        // Calculate potential height with current velocity: current height + additional height from velocity
        // Using kinematic equation: v² = u² - 2gh, rearranged to h = v²/(2g)
        const additionalHeight = (currentVelocity * currentVelocity) / (2 * this.jumpConfig.gravity);
        const potentialTotalHeight = currentY + additionalHeight;
        
        // If we're already going to fall short of minimum height, don't apply early release
        if (potentialTotalHeight <= this.jumpConfig.minJumpHeight) {
            // Early release ignored - would fall short of minimum height
            return;
        }
        
        const oldVelocity = this.jumpState.verticalVelocity;
        const proposedVelocity = this.jumpState.verticalVelocity * this.jumpConfig.earlyReleaseMultiplier;
        
        // Calculate what velocity we need to ensure we still reach minimum height
        const heightNeeded = this.jumpConfig.minJumpHeight - currentY;
        
        // If we're already above minimum height, no velocity restriction needed
        if (heightNeeded <= 0) {
            this.jumpState.verticalVelocity = proposedVelocity;
        } else {
            const minVelocityNeeded = Math.sqrt(2 * this.jumpConfig.gravity * heightNeeded);
            this.jumpState.verticalVelocity = Math.max(minVelocityNeeded, proposedVelocity);
        }
        this.jumpState.earlyReleaseApplied = true; // Mark that early release has been applied
        
        // Early release applied successfully
    }
    
    private canJump(): boolean {
        // Jump count check
        if (this.jumpState.jumpsRemaining <= 0) return false;
        
        // Ground or coyote time check
        const hasGroundOrCoyote = this.jumpState.isGrounded || 
            (this.advancedFeatures.coyoteTime !== undefined && this.jumpState.coyoteTimer > 0);
        
        // For first jump, need ground or coyote time AND no cooldown
        if (this.jumpState.jumpsRemaining === this.jumpConfig.maxJumps) {
            return hasGroundOrCoyote && this.jumpState.jumpCooldownTimer <= 0;
        } else {
            // Air jumps: no cooldown check, just need jumps remaining
            return true;
        }
    }
    
    private updateVerticalMovement(fastFallPressed: boolean, obj: TickerReturnData): void {
        if (this.jumpState.isGrounded && this.jumpState.verticalVelocity <= 0) {
            this.jumpState.verticalVelocity = 0;
            return;
        }
        
        // Calculate gravity multiplier
        let gravityMultiplier = 1.0;
        if (this.jumpState.verticalVelocity > 0) {
            gravityMultiplier = this.jumpConfig.ascendingGravity;
        } else {
            gravityMultiplier = this.jumpConfig.descendingGravity;
        }
        
        // Apply fast fall if configured
        if (fastFallPressed && this.advancedFeatures.fastFallMultiplier !== undefined && this.jumpState.verticalVelocity < 0) {
            gravityMultiplier *= this.advancedFeatures.fastFallMultiplier;
        }
        
        // Apply gravity (using same scaling as movement system)
        const gravity = this.jumpConfig.gravity * gravityMultiplier;
        const scaling = obj.intervalS10 / 120; // Same scaling as movement system
        const gravityApplication = gravity * scaling;
        this.jumpState.verticalVelocity -= gravityApplication;
        
        // Gravity applied
    }
    
    private onLanding(): void {
        this.jumpState.jumpsRemaining = this.jumpConfig.maxJumps;
        this.jumpState.lastGroundedTime = performance.now();
        this.jumpState.isJumping = false; // No longer jumping
        this.jumpState.earlyReleaseApplied = false; // Reset early release state on landing
        
        // Execute buffered jump if any (but only if no cooldown)
        if (this.jumpState.jumpBufferTimer > 0 && this.jumpState.jumpCooldownTimer <= 0) {
            this.tryJump();
        }
    }
    
    protected onJumpStart(jumpNumber: number): void {
        // Override in subclasses for custom jump effects
    }
    
    // Getters for jump state
    public isGrounded(): boolean { return this.jumpState.isGrounded; }
    public getJumpsRemaining(): number { return this.jumpState.jumpsRemaining; }
    public getVerticalVelocity(): number { return this.jumpState.verticalVelocity; }
    
    // Setters for runtime adjustment
    public setJumpHeight(height: number): void { 
        this.jumpConfig.jumpHeight = height;
        this.jumpConfig.jumpSpeed = this.calculateJumpSpeed(height);
    }
    public setGravity(gravity: number): void { this.jumpConfig.gravity = gravity; }
}
