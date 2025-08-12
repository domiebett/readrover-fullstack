import { describe, it, expect, vi } from 'vitest'
import { authEvents } from './authEvents'

describe('authEvents', () => {
  it('should register and call unauthorized listeners', () => {
    const listener1 = vi.fn()
    const listener2 = vi.fn()
    
    // Register listeners
    const unsubscribe1 = authEvents.onUnauthorized(listener1)
    const unsubscribe2 = authEvents.onUnauthorized(listener2)
    
    // Emit event
    authEvents.emitUnauthorized()
    
    expect(listener1).toHaveBeenCalledTimes(1)
    expect(listener2).toHaveBeenCalledTimes(1)
    
    // Emit again
    authEvents.emitUnauthorized()
    
    expect(listener1).toHaveBeenCalledTimes(2)
    expect(listener2).toHaveBeenCalledTimes(2)
    
    // Cleanup
    unsubscribe1()
    unsubscribe2()
  })

  it('should unsubscribe listeners correctly', () => {
    const listener1 = vi.fn()
    const listener2 = vi.fn()
    
    const unsubscribe1 = authEvents.onUnauthorized(listener1)
    const unsubscribe2 = authEvents.onUnauthorized(listener2)
    
    // Unsubscribe first listener
    unsubscribe1()
    
    authEvents.emitUnauthorized()
    
    expect(listener1).not.toHaveBeenCalled()
    expect(listener2).toHaveBeenCalledTimes(1)
    
    // Unsubscribe second listener
    unsubscribe2()
    
    authEvents.emitUnauthorized()
    
    expect(listener1).not.toHaveBeenCalled()
    expect(listener2).toHaveBeenCalledTimes(1) // Still only called once
  })

  it('should handle multiple emit calls without listeners', () => {
    // Should not throw when no listeners are registered
    expect(() => {
      authEvents.emitUnauthorized()
      authEvents.emitUnauthorized()
    }).not.toThrow()
  })

  it('should return unsubscribe function that can be called multiple times safely', () => {
    const listener = vi.fn()
    const unsubscribe = authEvents.onUnauthorized(listener)
    
    // First unsubscribe
    unsubscribe()
    authEvents.emitUnauthorized()
    expect(listener).not.toHaveBeenCalled()
    
    // Second unsubscribe (should be safe)
    expect(() => unsubscribe()).not.toThrow()
    
    authEvents.emitUnauthorized()
    expect(listener).not.toHaveBeenCalled()
  })

  it('should support adding same listener multiple times', () => {
    const listener = vi.fn()
    
    const unsubscribe1 = authEvents.onUnauthorized(listener)
    const unsubscribe2 = authEvents.onUnauthorized(listener)
    
    authEvents.emitUnauthorized()
    
    // Should be called twice since it was added twice
    expect(listener).toHaveBeenCalledTimes(2)
    
    // Unsubscribe one instance
    unsubscribe1()
    authEvents.emitUnauthorized()
    
    // Should be called once since one instance is still registered
    expect(listener).toHaveBeenCalledTimes(3)
    
    // Unsubscribe second instance
    unsubscribe2()
    authEvents.emitUnauthorized()
    
    // Should not be called anymore
    expect(listener).toHaveBeenCalledTimes(3)
  })
})