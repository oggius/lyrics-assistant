import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppConfigService } from '../../config/config.service';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private store: RateLimitStore = {};
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(private readonly configService: AppConfigService) {
    const securityConfig = this.configService.securityConfig;
    this.windowMs = securityConfig.rateLimitWindowMs;
    this.maxRequests = securityConfig.rateLimitMaxRequests;
  }

  use(req: Request, res: Response, next: NextFunction) {
    const clientId = req.ip || 'unknown';
    const now = Date.now();

    // Clean up expired entries
    Object.keys(this.store).forEach((key) => {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    });

    // Initialize or get client data
    if (!this.store[clientId]) {
      this.store[clientId] = {
        count: 0,
        resetTime: now + this.windowMs,
      };
    }

    const clientData = this.store[clientId];

    // Reset if window has expired
    if (clientData.resetTime < now) {
      clientData.count = 0;
      clientData.resetTime = now + this.windowMs;
    }

    // Increment request count
    clientData.count++;

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', this.maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, this.maxRequests - clientData.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(clientData.resetTime / 1000));

    // Check if limit exceeded
    if (clientData.count > this.maxRequests) {
      res.status(429).json({
        success: false,
        statusCode: 429,
        message: 'Too many requests, please try again later.',
        retryAfter: Math.ceil((clientData.resetTime - now) / 1000),
      });
      return;
    }

    next();
  }
}