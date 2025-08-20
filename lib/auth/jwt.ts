import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error("JWT secrets are not defined in environment variables")
}

export interface JWTPayload {
  userId: string
  email: string
  username: string
}

export interface RefreshTokenPayload {
  userId: string
}

// Generate access token (expires in 15 minutes)
export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" })
}

// Generate refresh token (expires in 7 days)
export function generateRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" })
}

// Verify access token
export function verifyAccessToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    throw new Error("Invalid or expired access token")
  }
}

// Verify refresh token
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload
  } catch (error) {
    throw new Error("Invalid or expired refresh token")
  }
}

// Generate token pair
export function generateTokenPair(payload: JWTPayload) {
  const accessToken = generateAccessToken(payload)
  const refreshToken = generateRefreshToken({ userId: payload.userId })

  return {
    accessToken,
    refreshToken,
  }
}
