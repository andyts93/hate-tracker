"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const [name, setName] = useState<string>("");
  const router = useRouter();
  const { isOpen, onOpenChange } = useDisclosure();

  const createNew = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/person", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      const json = await response.json();

      if (!response.ok) return toast.error(json.error);

      router.push(`/${json.id}`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Hold on!</ModalHeader>
              <ModalBody>
                <p>
                  If you are Elisa (and I think you are), I&apos;ve made quite
                  some changes, I got pretty involved in this..
                </p>
                <p>
                  Well, whatever, your link is now{" "}
                  <Link
                    className="text-orange-500 hover:underline"
                    href={"/ef34be5c-156a-42bb-80bc-ca00a30fe56a"}
                  >
                    this.
                  </Link>
                </p>
                <p>
                  Mine,{" "}
                  <em>
                    if you care at least a little bit about how much I hate you
                    over time
                  </em>
                  , is{" "}
                  <Link
                    className="text-orange-500 hover:underline"
                    href={"/ed039b79-3768-489b-ab1f-f5cfd32c9f82"}
                  >
                    this.
                  </Link>
                </p>
                <p>
                  In the menu you can find the <em>Last viewed</em> option, so
                  you don&apos;t have to keep the links saved somewhere, as long
                  as you use the same device.
                </p>
                <p>
                  Have a great day! Remember to hate me a little less now (:
                </p>
              </ModalBody>
              <ModalFooter>
                <button onClick={onClose}>Close</button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <h1 className="text-3xl font-bold text-center uppercase bg-gradient-to-br from-purple-500 to-red-500 bg-clip-text text-transparent">
        It would be fun to track your beloved love/hate feeling over time,
        right? Now you can
      </h1>
      <p className="mt-4 text-center">
        Create a page for the person you want to track the mood of, and share
        the link with them!
      </p>
      <p className="mt-1 underline text-center">
        No registration required, don&apos;t lose your link!
      </p>

      <form className="mt-8" onSubmit={createNew}>
        <div className="flex flex-col border border-gray-700 p-2 shadow-brutal-sm shadow-gray-600 rounded">
          <label className="text-sm text-gray-400 mb-1" htmlFor="name">
            Name
          </label>
          <input
            className="bg-gray-700 px-2 py-1 focus:outline-none rounded"
            id="name"
            placeholder="Insert name here"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="px-2 py-1 rounded bg-green-500 mt-2 text-sm">
            Create
          </button>
        </div>
      </form>
    </>
  );
}
