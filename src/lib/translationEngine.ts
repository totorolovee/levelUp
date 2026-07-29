import type { Language } from './language';
import { englishPlaceholders } from './translationDictionary';
import { english } from './translations';

type SavedText = { source: string; translated: string };
const savedText = new WeakMap<Text, SavedText>();
const savedAttributes = new WeakMap<Element, Map<string, string>>();

function translatedText(source: string) {
  const normalized = source.trim().replace(/\s+/g, ' ');
  const direct = english[normalized];
  if (direct) {
    const leading = source.match(/^\s*/)?.[0] ?? '';
    const trailing = source.match(/\s*$/)?.[0] ?? '';
    return `${leading}${direct}${trailing}`;
  }
  return source
    .replace(/Куплено: (\d+) шт\./, 'Owned: $1')
    .replace(/(\d+) книг выбрано/, '$1 books selected')
    .replace(/(\d+) шагов выполнено/, '$1 steps completed')
    .replace(/(\d+) символов/, '$1 characters')
    .replace(/Покупка ([A-Z.]+)/, 'Buying $1')
    .replace(/Почему именно (.+), а не просто популярная компания\?/, 'Why $1 specifically, rather than just a popular company?')
    .replace(/Уверенность:/, 'Confidence:')
    .replace(/Вопрос (\d+) из (\d+)/, 'Question $1 of $2')
    .replace(/Обновлено /, 'Updated ')
    .replace(/автоматически каждые 12 часов/, 'automatically every 12 hours')
    .replace(/Твои (\$[^.]+)\. Твои решения\. Ноль риска\./, 'Your $1. Your decisions. Zero risk.')
    .replace(/Осталось /, 'Remaining ')
    .replace(/ куплено за /, ' bought for ')
    .replace(/ шт\. · /, ' shares · ')
    .replace(/ за акцию/, ' per share')
    .replace(/Новичок (\d)/, 'Beginner $1')
    .replace(/Исследователь (\d)/, 'Explorer $1')
    .replace(/Стратег (\d)/, 'Strategist $1')
    .replace(/Мастер (\d)/, 'Master $1')
    .replace(/Легенда (\d)/, 'Legend $1')
    .replace(/Божество (\d)/, 'Deity $1')
    .replace(/XP до ранга/, 'XP to rank');
}

function translateTextNode(node: Text, language: Language) {
  const saved = savedText.get(node);
  if (language === 'ru') {
    if (saved && node.nodeValue === saved.translated) node.nodeValue = saved.source;
    return;
  }
  const current = node.nodeValue ?? '';
  if (saved && current === saved.translated) return;
  const translated = translatedText(current);
  if (translated !== current) {
    savedText.set(node, { source: current, translated });
    node.nodeValue = translated;
  }
}

function translateAttributes(element: Element, language: Language) {
  const attributes = ['placeholder', 'aria-label', 'title'];
  const saved = savedAttributes.get(element) ?? new Map<string, string>();
  for (const name of attributes) {
    const current = element.getAttribute(name);
    if (!current) continue;
    if (language === 'ru') {
      const source = saved.get(name);
      if (source) element.setAttribute(name, source);
      continue;
    }
    if (!saved.has(name)) saved.set(name, current);
    const source = saved.get(name) ?? current;
    element.setAttribute(
      name,
      englishPlaceholders[source] ?? english[source] ?? translatedText(source),
    );
  }
  savedAttributes.set(element, saved);
}

export function translateElement(root: Element, language: Language) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    translateTextNode(node as Text, language);
    node = walker.nextNode();
  }
  translateAttributes(root, language);
  root.querySelectorAll('*').forEach((element) => translateAttributes(element, language));
}
