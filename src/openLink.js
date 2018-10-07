export default function openLink(url) {
  NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(url))
}
