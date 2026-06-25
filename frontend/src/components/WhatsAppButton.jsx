function WhatsAppButton({ children = 'Contactar por WhatsApp', href = 'https://wa.me/51930700147' }) {
  return (
    <a className="whatsapp-button" href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

export default WhatsAppButton;
