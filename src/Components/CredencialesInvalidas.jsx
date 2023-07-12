export const CredencialesInvalidas = ({ onClose, isOpen, mensaje = "Por favor verifique los datos suministrados y vuelva a intentarlo nuevamente"}) => {
  if (!isOpen) return null;
  return (
    <div className="modal">
      <div className="modal-content">
        <h1 className="titulo-credenciales">Ha ocurrido un error</h1>
        <p className="parrafo-credenciales">
         {mensaje}
        </p>
        <div>
          <button
            className="btn-close"
            onClick={() => {
              onClose();
            }}
          >
            Regresar
          </button>
        </div>
      </div>
    </div>
  );
};
