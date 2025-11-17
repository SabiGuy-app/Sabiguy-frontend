import Modal from "../../components/Modal";
import Button from "../../components/button";

export default function Success ({ isOpen, onClose })  {

    return (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="flex flex-col items-center justify-center text-center py-6">
      <img 
        src="/Okay.svg" 
        alt="Success" 
        className="w-32 h-32 mb-6"
      />

      <h2 className="font-semibold text-2xl text-gray-900 mb-3">
        Password Reset Successful
      </h2>

      <p className="text-gray-500 text-sm mb-6 max-w-sm">
        You can now use your new password to login into your account
      </p>

      <Button 
        variant="secondary"
        onClick={onClose}
      >
        Login
      </Button>
    </div>
  </Modal>
);

}