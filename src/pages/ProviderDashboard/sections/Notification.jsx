import NotificationDrawer from "../../../components/dashboard/Notification";
import { useState } from "react";


export default function Notifications () {
      const [open, setOpen] = useState(false);
    
    <NotificationDrawer isOpen={open} onClose={() => setOpen(false) }>

    </NotificationDrawer>
}