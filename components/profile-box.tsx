import { Avatar } from "@nextui-org/avatar";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { v4 as uuid4 } from "uuid";
import { BsCloudUploadFill } from "react-icons/bs";
import toast from "react-hot-toast";

import { FullPageLoader } from "./full-page-loader";

import { Person } from "@/types";

interface ProfileBoxProps {
  person: Person;
  onSaved?: () => void;
}
export default function ProfileBox({ person, onSaved }: ProfileBoxProps) {
  const t = useTranslations();
  const voteImagesRef = useRef<HTMLInputElement>(null);
  const [voteImageKey, setVoteImageKey] = useState<string>(uuid4());
  const [fileName, setFileName] = useState<string>(t("Forms.uploadImage"));
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = () => {
    const file = voteImagesRef.current?.files
      ? voteImagesRef.current?.files[0]
      : null;

    if (file) {
      setFileName(file.name);
    } else {
      setFileName("Upload image");
    }
  };

  const save = async () => {
    const formData = new FormData();

    if (voteImagesRef.current?.files && voteImagesRef.current.files[0]) {
      formData.append("image", voteImagesRef.current.files[0]);
    } else return;
    setLoading(true);
    try {
      const res = await fetch(`/api/person/${person.id}/avatar`, {
        method: "PUT",
        body: formData,
      });

      setLoading(false);

      if (res.ok) {
        setFileName(t("Forms.uploadImage"));
        setVoteImageKey(uuid4());
        toast.success(t("Page.profile.set"));
        onSaved?.();
      } else {
        const json = await res.json();

        toast.error(json.error);
      }
    } catch (err: any) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <FullPageLoader />}
      <div className="bg-purple-400 py-2 px-4 rounded shadow-brutal shadow-purple-600 mt-4 w-full">
        <div className="flex gap-4 items-center">
          <Avatar
            alt={person.name}
            fallback={person.name.substring(0, 1)}
            name={person.name}
            size="lg"
            src={person.avatar}
          />
          <input
            key={voteImageKey}
            ref={voteImagesRef}
            accept="image/*"
            className="hidden"
            id="note-image"
            multiple={false}
            type="file"
            onChange={handleFileChange}
          />
          <label
            className="flex gap-2 items-center text-sm bg-gray-800 rounded px-2 py-1"
            htmlFor="note-image"
          >
            <BsCloudUploadFill className="w-6" />
            <span>{fileName}</span>
          </label>
        </div>
        <button
          className="px-4 py-1 rounded-2xl bg-purple-600 mt-4 disabled:opacity-70 disabled:pointer-events-none flex items-center gap-2"
          onClick={save}
        >
          {t("Forms.save")}
        </button>
      </div>
    </>
  );
}
