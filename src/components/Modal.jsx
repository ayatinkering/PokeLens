import ReactDom from "react-dom";

export default function Modal({
  children,
  handleCloseModal,
}) {
  return ReactDom.createPortal(
    <div className="fixed inset-0 z-50">

      <div
        className="absolute inset-0 bg-black/80"
        onClick={handleCloseModal}
      />

      <div
        className="
          absolute
          top-1/2
          left-1/2
          -translate-x-1/2
          -translate-y-1/2
        "
      >
        {children}
      </div>

    </div>,
    document.getElementById("portal")
  );
}