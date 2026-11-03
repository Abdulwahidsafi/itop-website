export const shopDirections = 'https://www.google.com/maps/search/?api=1&query=iTop%2C%20160%20Rushey%20Green%2C%20London%20SE6%204HQ';

export function StoreDetails() {
  return <div className="contact-details">
    <section aria-labelledby="shop-address-title"><h3 id="shop-address-title">Shop address</h3><address><strong>160 Rushey Green</strong><br />Catford, London SE6 4HQ</address><div className="visit-actions"><a className="text-button" href={shopDirections} target="_blank" rel="noopener noreferrer">Get directions</a><a className="text-button" href="https://share.google/a0LGBbCRpooeHfBlN" target="_blank" rel="noopener noreferrer">Google profile</a></div></section>
    <section id="shop-hours" tabIndex={-1} aria-labelledby="shop-hours-title"><h3 id="shop-hours-title">Opening hours</h3><table className="hours-table"><caption className="sr-only">Shop opening hours</caption><tbody><tr><th scope="row">Monday–Saturday</th><td>08:00–21:30</td></tr><tr><th scope="row">Sunday</th><td>10:00–21:30</td></tr></tbody></table><p className="hours">Call to confirm bank holiday or temporary changes.</p></section>
    <section aria-labelledby="shop-contact-title"><h3 id="shop-contact-title">Contact the shop</h3><p>Retail, repairs & aftercare</p><div className="contact-links"><a href="tel:+447760616466">Call 07760 616 466</a><a href="https://wa.me/447760616466" target="_blank" rel="noopener noreferrer">WhatsApp 07760 616 466</a><a href="mailto:info.itop@gmail.com">Email info.itop@gmail.com</a></div></section>
  </div>;
}
