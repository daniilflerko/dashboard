export const getError = (err: any): string => {
    return err instanceof Error ? err.message : String(err)
}