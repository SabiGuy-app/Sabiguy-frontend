{/*const people = [
  {
    name: 'Leslie Alexander',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
   
  },
  {
    name: 'Michael Foster',
    imageUrl:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Dries Vincent',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
]

export default function Example() {
  return (
   <div className="max-w-6xl mx-auto mt-14 sm:mt-16 px-4 sm:px-6 md:px-8 space-y-8">
        <div className="bg-green rounded-xl shadow-md p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-black-900 mb-4">
            Assign a Driver
          </h2>
      <div className="space-y-3">
      {people.map((person) => (
          <div className="border border-green-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <img
              alt=""
              src={person.imageUrl}
              className="size-12 flex-none rounded-full outline -outline-offset-1 outline-white/10"
            />
             <div className="min-w-0 flex-auto">
              <p className="text-sm/6 font-semibold text-black">{person.name}</p>
            </div>
        
              <p className="text-sm/6 font-semibold text-green">Assign </p>

              <svg href="#" className="cursor-pointer" xmlns="http://www.w3.org/2000/svg" height="20" width="40" viewBox="0 0 512 512">
              <path fill="rgb(99, 230, 190)" d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-105.4 105.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
              </svg>
              
              </div>
         
      ))}
    </div>
    </div>
    </div>
  )
}*/}


'use client'
import { useState } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'

const people = [
  {
    name: 'Tunde Adeyemi',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Samuel Cutti',
    imageUrl:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Jackson Joe',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
]

export default function AssignDriverModal() {
  const [open, setOpen] = useState(true)

  return (
    <>
      {/*<button
        onClick={() => setOpen(true)}
        className="rounded-md bg-green-600 px-4 py-2 text-white"
      >
        Assign Driver
      </button>*/}

      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/30" />

        <div className="fixed inset-0 flex items-center justify-center px-4 py-8 ">
          <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <DialogTitle className="mb-5 text-xl font-semibold text-gray-900">
              Assign a driver
            </DialogTitle>

            <div className="space-y-3">
              {people.map((person) => (
                <button
                  key={person.name}
                  className="flex w-full items-center justify-between rounded-lg border border-gray-200 p-3 transition hover:border-green-500 hover:bg-green-50"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={person.imageUrl}
                      alt={person.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />

                    <p className="text-sm font-medium text-gray-900">
                      {person.name}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                    <span>Assign</span>
                    <svg href="#" className="cursor-pointer" height="20" width="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                    <path fill="rgb(7, 134, 96)" d="M566.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L466.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l434.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"/>
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}


