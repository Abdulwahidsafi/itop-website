export const accessoryCategories = [
  { title: 'Protection', image: 'protection', text: 'Find the right protection for your device. Tell us the exact model and your preferred style.', items: ['Cases', 'Screen protectors', 'Camera protection'] },
  { title: 'Power', image: 'power', text: 'Keep your everyday tech charged. We’ll check the connector and compatibility with you.', items: ['Cables', 'Chargers', 'Power banks'] },
  { title: 'Audio', image: 'audio', text: 'Listen your way. Ask about wired or wireless options and current availability.', items: ['Earphones', 'Headphones', 'Speakers'] },
];

export function accessoryCategory(item: string) {
  return accessoryCategories.find(category => category.items.includes(item))?.title ?? '';
}
