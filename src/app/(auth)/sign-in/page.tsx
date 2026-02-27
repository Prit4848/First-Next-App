"use client";

import { useSession } from "next-auth/react"

export default function Page() {

 
    return (
      <>
        <p>Signed in as </p>

        {/* Update the value by sending it to the backend. */}
        <button >Edit name</button>
        {/*
         * Only trigger a session update, assuming you already updated the value server-side.
         * All `useSession().data` references will be updated.
         */}
        <button>Edit name</button>
      </>
    )
  

  
}
