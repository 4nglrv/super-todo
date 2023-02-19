export default function throttle(func: (...args: any) => void, ms: number) {
  let timeout = false
  return (...args: any) => {
    if (timeout) return
    func(...args)
    timeout = true
    setTimeout(() => timeout = false, ms)
  }
}