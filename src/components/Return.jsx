'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

export default function Example() {
  const [open, setOpen] = useState(true)

  return (
    <div>
      {/*<button
        onClick={() => setOpen(true)}
        className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-white/10 hover:bg-white/20"
      >
        Return Driver
      </button>*/}
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/35 transition-opacity duration-300 ease-out data-closed:opacity-0 data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 flex w-screen items-center justify-center overflow-y-auto p-4">
          <div className="flex min-h-full items-center justify-center">
            <DialogPanel
              transition
              className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] ring-1 ring-black/5 transition-all duration-300 ease-out data-closed:translate-y-3 data-closed:scale-95 data-closed:opacity-0 data-leave:duration-200 data-leave:ease-in"
            >
              <div className="px-8 pb-4 pt-10 text-center sm:px-10">
                <DialogTitle as="h3" className="text-[22px] font-semibold tracking-tight text-slate-900">
                  Remove driver
                </DialogTitle>
                <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-slate-500">
                  This driver will be removed from the selected vehicle. You can assign them to another vehicle at any time.
                </p>
              </div>

              <div className="px-8 pb-8 pt-2 sm:px-10">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    href="#"
                    data-autofocus
                    onClick={() => setOpen(false)}
                    className="inline-flex w-full justify-center rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                  >
                    Continue
                  </button>

                  <button
                    type="button"
                    href="#"
                    onClick={() => setOpen(false)}
                    className="inline-flex w-full justify-center rounded-md bg-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                  >
                    Remove Driver
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
