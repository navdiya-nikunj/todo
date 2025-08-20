import type { NextRequest } from "next/server"
import { verifyAccessToken, type JWTPayload } from "./jwt"

export interface AuthenticatedRequest extends NextRequest {
  user: JWTPayload
}

// Extract token from Authorization header
export function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  return authHeader.substring(7) // Remove "Bearer " prefix
}

// Authenticate request and return user payload
export function authenticateRequest(request: NextRequest): JWTPayload {
  const token = extractToken(request)

  if (!token) {
    throw new Error("No authentication token provided")
  }

  try {
    return verifyAccessToken(token)
  } catch (error) {
    throw new Error("Invalid authentication token")
  }
}

// Middleware wrapper for protected routes
export function withAuth(handler: (request: AuthenticatedRequest) => Promise<Response>) {
  return async (request: NextRequest): Promise<Response> => {
    try {
      const user = authenticateRequest(request)
      const authenticatedRequest = request as AuthenticatedRequest
      authenticatedRequest.user = user

      return await handler(authenticatedRequest)
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          message: error instanceof Error ? error.message : "Authentication failed",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      )
    }
  }
}
