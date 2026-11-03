import { DeviceMobile, Headphones, ArrowsLeftRight, Package, MapPin, ArrowUpRight } from '@phosphor-icons/react';
import { siteHref } from './sitePaths';

const paths = [
  { title: 'Repair a device', description: 'Choose your model and describe the fault.', path: 'repairs/', icon: DeviceMobile },
  { title: 'Find accessories', description: 'Protection, charging and audio.', path: 'accessories/', icon: Headphones },
  { title: 'Buy or sell', description: 'Ask about a device or its value.', path: 'buy-sell/', icon: ArrowsLeftRight },
  { title: 'Wholesale supply', description: 'Browse the catalogue and request a quote.', path: 'wholesale/', id: 'trade', icon: Package },
  { title: 'Visit the shop', description: 'Opening hours, directions and contacts.', path: 'contact/', icon: MapPin },
];

export function ServiceSelector() {
  return <section id="services" className="service-selector home-service-selector" aria-labelledby="service-selector-title">
    <h2 id="service-selector-title">What can we help you with?</h2>
    <div className="service-paths">{paths.map(({icon: Icon, ...item}) => <a key={item.path} id={item.id} className="service-path" href={siteHref(item.path)}>
      <div className="service-path-top"><Icon size={28} weight="light" aria-hidden="true" /><ArrowUpRight size={18} aria-hidden="true" /></div>
      <h3>{item.title}</h3><p>{item.description}</p>
    </a>)}</div>
  </section>;
}
