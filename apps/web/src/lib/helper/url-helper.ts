export function PruneSuffix(text: string, suffix: string) {
	if (hasContent(suffix, WhitespaceMode.Preserve) && text?.endsWith(suffix)) {
		return text.substring(0, text.length - suffix.length);
	}
	return text;
}

export function PrunePrefix(text: string, prefix: string) {
	if (hasContent(prefix, WhitespaceMode.Preserve) && text?.startsWith(prefix)) {
		return text.substring(prefix.length, text.length - prefix.length);
	}
	return text;
}

enum WhitespaceMode {
	Trim,
	Preserve
}

function hasContent(text: string | undefined, whitespaceMode: WhitespaceMode): boolean {
	let refinedText = text ?? '';
	if (whitespaceMode == WhitespaceMode.Trim) {
		refinedText = refinedText.trim();
	}
	return refinedText.length > 0;
}
