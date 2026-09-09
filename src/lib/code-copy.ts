// Shared code-block copy handler for every page rendering markdown.
// Idempotent: buttons are flagged after binding, safe to call on every navigation.
export function attachCodeCopy(root: ParentNode = document): void {
  root.querySelectorAll<HTMLButtonElement>(".code-copy[data-copy]").forEach((b) => {
    if ((b as any)._boundCopy) return
    ;(b as any)._boundCopy = true
    b.addEventListener("click", async () => {
      const block = b.closest(".code-block")
      const code = block?.querySelector("code")?.textContent ?? ""
      const copyLabel = b.dataset.copyLabel ?? "Copy"
      const copiedLabel = b.dataset.copiedLabel ?? "Copied!"
      try {
        await navigator.clipboard.writeText(code)
        const prev = b.textContent
        b.textContent = copiedLabel
        setTimeout(() => { b.textContent = prev }, 1200)
        void copyLabel
      } catch {
        // clipboard unavailable — leave label unchanged
      }
    })
  })
}
