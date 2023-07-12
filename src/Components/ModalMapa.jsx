export const ModalMapa = ({ onClose, isOpen, location }) => {
  if (!isOpen) return null;
  return (
    <div className="modal">
      <div className="modal-content modal-map">
        <div className="modal-url">
          <iframe
            src={location}
            width="400"
            height="400"
            style={{ border: "0" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <button
          className="btn-close my-4"
          onClick={() => {
            onClose();
          }}
        >
          Regresar
        </button>
      </div>
    </div>
  );
};
