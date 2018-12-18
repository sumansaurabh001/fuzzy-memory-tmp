

export function apiError(res, errorDescription) {
  console.log(errorDescription);
  res.status(500).json({errorDescription});
}
