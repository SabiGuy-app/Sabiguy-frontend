import Modal from "../Modal";

export default function ReviewSent ({ isOpen, onClose}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col items-center justify-center text-center py-6">

                 <img 
        src="/Okay.svg" 
        alt="Success" 
        className="w-32 h-32 mb-6"
      />
       <h2 className="font-semibold text-2xl text-gray-900 mb-3">
        Review Sent
      </h2>
       <p className="text-gray-500 text-sm mb-6 max-w-sm">
        Customer need to review and approve the project before it can be completed
      </p>

            </div>



        </Modal>
    )
}