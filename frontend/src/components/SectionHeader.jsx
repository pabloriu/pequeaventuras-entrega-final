function SectionHeader({ eyebrow, title, children }) {
  return (
    <div className="section-header">
      {eyebrow && <span><i aria-hidden="true" />{eyebrow}</span>}
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

export default SectionHeader;
