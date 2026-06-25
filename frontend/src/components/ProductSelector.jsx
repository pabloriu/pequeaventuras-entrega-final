function ProductSelector({ checked, label, onChange }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={label}
    />
  );
}

export default ProductSelector;
