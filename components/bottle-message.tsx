import { useRef, useState } from "react";
import { LuInfo } from "react-icons/lu";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { v4 as uuid4 } from "uuid";
import { BsCloudUploadFill } from "react-icons/bs";

import { FullPageLoader } from "./full-page-loader";

import { Person } from "@/types";

interface BottleMessageProps {
  person?: Person;
  onSaved?: () => void;
}

export default function BottleMessageForm({
  person,
  onSaved,
}: BottleMessageProps) {
  const [message, setMessage] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState<boolean>(false);
  const t = useTranslations();
  const voteImagesRef = useRef<HTMLInputElement>(null);
  const [voteImageKey, setVoteImageKey] = useState<string>(uuid4());
  const [fileName, setFileName] = useState<string>(t("Forms.uploadImage"));

  const saveMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    formData.append("message", message);
    formData.append("person_id", String(person?.id));

    if (voteImagesRef.current?.files && voteImagesRef.current.files[0]) {
      formData.append("image", voteImagesRef.current.files[0]);
    }
    try {
      const res = await fetch("/api/message", {
        method: "POST",
        body: formData,
      });

      setLoading(false);

      if (res.ok) {
        setMessage("");
        setVoteImageKey(uuid4());
        toast.success(t("Page.bottleMessage.sent"));
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

  return (
    <>
      {loading && <FullPageLoader />}
      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>{t("Page.bottleMessage.modal.title")}</ModalHeader>
          <ModalBody>
            <p className="mb-2">
              {t("Page.bottleMessage.modal.description", {
                name: person?.name,
              })}
            </p>
          </ModalBody>
        </ModalContent>
      </Modal>
      <div className="bg-purple-400 py-2 px-4 rounded shadow-brutal shadow-purple-600 mt-4 w-full">
        <p className="mb-2 text-sm font-semibold flex items-center">
          <svg
            className="w-8 fill-white"
            id="icon"
            version="1.1"
            viewBox="0 0 512 512"
            xmlSpace="preserve"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0" />
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <g id="SVGRepo_iconCarrier">
              {" "}
              <g>
                {" "}
                <path d="M426.157196,121.7216034l-57.611084-50.026001c-5.9807129-5.1843033-15.0767212-4.5481033-20.2713013,1.4381943 l-10.3528137,11.9311066c-5.1944885,5.9807968-4.552887,15.0764999,1.428009,20.2659988l8.2089844,7.1256943 l-43.9010925,50.5654068c-34.7782898-14.8787994-76.6896973-6.5162964-102.7966003,23.5540924L86.8287964,317.9356079 c-4.5632935,5.2511902-8.8422928,14.8695984-3.3317947,30.8360901 c12.629097,36.6051025,70.3698959,86.7296143,108.3871994,94.0970154c3.3892059,0.6520996,6.4521027,0.9415894,9.2250977,0.9415894 c10.8188019,0,17.2082977-4.3923035,20.8352051-8.5728149l114.0373993-131.359375 c26.0987854-30.0662231,28.4967957-72.736908,8.8768921-105.0867157l43.9009094-50.5691986l8.2062988,7.1244965 c2.6289063,2.281601,5.9293823,3.5075989,9.3908997,3.5075989c0.3414917,0,0.6882019-0.0101013,1.0397949-0.0358887 c3.8337097-0.2690125,7.3315125-2.0127106,9.8356018-4.9049988l10.3576965-11.9258118 C432.7850952,136.0066071,432.1431885,126.9162979,426.157196,121.7216034z M327.9830933,296.9346924L213.9454956,428.2940979 c-3.978302,4.5736084-10.7200012,5.9862061-20.0429993,4.170105 c-34.5101929-6.6846008-88.9237976-53.9222107-100.3890991-87.1485901 c-3.0991974-8.9818115-2.6591949-15.8580017,1.3146057-20.436615l114.0317993-131.3594971 c15.5783997-17.9378967,37.5368958-27.1266022,59.6134949-27.1266022c18.3308105,0,36.7498169,6.3432007,51.6506042,19.2723999 C352.9625854,214.1784973,356.4859924,264.0909119,327.9830933,296.9346924z M338.6108093,189.831604 c-3.4153137-4.3253021-7.2325134-8.4224091-11.5435181-12.1648102c-4.3087769-3.7415924-8.9006042-6.9433899-13.6604004-9.7167969 l42.1504211-48.5494003l25.2035828,21.8783035L338.6108093,189.831604z M419.5914917,135.0442047l-10.3630981,11.9257965 c-0.6520996,0.7554016-1.5675964,1.2106934-2.5816956,1.2779999c-0.9263,0.1291962-1.976593-0.243103-2.7370911-0.9002075 l-12.2023926-10.5934906c-0.0015259-0.0006104-0.0015259-0.001297-0.0028992-0.0027008 c-0.0013123-0.0012054-0.0025024-0.0012054-0.0025024-0.0012054l-33.1903992-28.8119965 c-0.003418-0.0026016-0.0039063-0.0076981-0.0078125-0.0102997c-0.0036926-0.0033035-0.0078125-0.0038986-0.0116882-0.0066986 L346.293396,97.3320999c-0.7503052-0.6573029-1.2055969-1.572998-1.2781067-2.5818024 c-0.0668945-1.0141983,0.2537231-1.9868011,0.905304-2.7422943l10.3532104-11.9309006 c0.7449036-0.858902,1.800293-1.2987061,2.8559875-1.2987061c0.8793945,0,1.7590027,0.3053055,2.4732056,0.9210052 l57.6108093,50.0211029C420.7557983,131.0605927,420.9316101,133.497406,419.5914917,135.0442047z" />{" "}
                <path d="M289.4689026,227.0563965c-11.4602051-9.2870941-18.7915039-7.4295959-22.1289063-5.4790955 c-0.1166992,0.0684967-0.2494812,0.1766968-0.3710938,0.2536011c-0.0220032,0.014801-0.0477905,0.0153046-0.0686035,0.0309906 l-0.3917847,0.2832031c-0.1953125,0.1379089-0.3819275,0.2588043-0.5835266,0.4210968l-72.048584,52.0381165 l-74.8145065,33.2162781c-0.1706009,0.0776062-0.3465958,0.1655273-0.5118942,0.2637024 c-3.337204,1.9403076-8.5833054,7.3728027-6.1828995,21.9424133c1.5006943,9.0904846,5.6396942,19.7951965,11.6620941,30.1481018 c10.0578995,17.3067932,24.7466049,32.1608887,36.4081955,32.1608887c2.1682129,0,4.2378082-0.517395,6.1464996-1.6297913 c0.1607056-0.0878906,0.3157043-0.1914978,0.4656067-0.3001099l62.469696-45.6437988l85.456604-40.3511047 c0.0531921-0.0250854,0.084198-0.0748901,0.1366882-0.1015015c0.085907-0.0470886,0.1809082-0.060791,0.2671204-0.1105957 c12.1737976-7.0776978,6.4570007-31.5657959-5.4790039-52.0955963 C303.8829956,241.7503052,296.629303,232.8565063,289.4689026,227.0563965z M224.5417023,335.3973999 c-0.3052063,0.1445923-0.5950012,0.3153992-0.8639984,0.512085l-62.5623016,45.7112122 c-3.0991058,1.2727051-16.0028992-6.255188-27.9286957-26.7748108 c-5.3911057-9.2664795-9.0693054-18.6932983-10.3633041-26.5419922c-1.0967026-6.64328-0.0620041-10.156189,0.921196-10.968689 l74.9384003-33.2680054c0.3307953-0.1499023,0.6515961-0.3310852,0.9517059-0.5484009l61.0715027-44.1098022 c0.0959778,1.2985992,0.2118835,2.6231079,0.4562988,4.1054077c1.4950867,9.0905914,5.6394043,19.7955017,11.6567993,30.1533813 c6.696991,11.5171204,15.4414063,21.9204102,23.9781799,27.6104126L224.5417023,335.3973999z M310.0956116,294.998291 l-0.1682129,0.0789185c-2.9255066,1.321991-15.9562988-6.1122131-27.9501953-26.7384949 c-5.3862-9.2664185-9.0646973-18.6983185-10.3634949-26.5470123c-1.0863953-6.5955048-0.071106-10.072403,0.9015808-10.913208 l0.2174988-0.1564941c0.1912231-0.0982056,0.4515076-0.1629028,0.8055115-0.1629028 c1.6141968,0,4.8427124,1.1538086,9.2614136,4.7290039c6.1825867,5.0083008,12.5517883,12.8722992,17.942688,22.1440887 C312.8135986,278.1910095,312.7750854,293.2648926,310.0956116,294.998291z" />{" "}
                <path d="M293.1007996,261.8768005c-2.7988892-4.8222961-3.9992981-8.4389038-4.2944946-10.0169067 c0.7970886-1.5570984,0.8070984-3.4716949-0.1343079-5.091095c-1.4693909-2.5350952-4.7132874-3.3889008-7.2435913-1.9142914 c-6.4619141,3.7613983-2.2041016,14.2282867,2.5144043,22.345993c2.2612,3.8855896,4.8014832,7.3674011,7.1557922,9.8044128 c2.7782898,2.8766785,5.4013062,4.320282,7.8381042,4.320282c1.1022949,0,2.1679993-0.295105,3.1875-0.8899841 c2.5299988-1.4746094,3.3834839-4.7132263,1.914093-7.2433167c-0.9417114-1.6192932-2.6126099-2.5559998-4.3562012-2.6283875 C298.450592,269.5234985,295.9049988,266.6882935,293.1007996,261.8768005z" />{" "}
              </g>{" "}
            </g>
          </svg>{" "}
          <span>{t("Page.bottleMessage.title", { name: person?.name })}</span>
          <button onClick={onOpen}>
            <LuInfo className="ml-1" />
          </button>
        </p>
        <form className="flex flex-col" onSubmit={saveMessage}>
          <textarea
            className="bg-gray-800 px-2 py-1 focus:outline-none rounded text-sm h-24 resize-none mb-2"
            placeholder={t("Page.bottleMessage.messagePlaceholder")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
            className="flex gap-2 items-center text-xs bg-gray-800 rounded px-2 py-1"
            htmlFor="note-image"
          >
            <BsCloudUploadFill className="w-6" />
            <span>{fileName}</span>
          </label>
          <button className="px-2 py-1 rounded bg-purple-600 mt-2 text-sm">
            {t("Page.bottleMessage.send")}
          </button>
        </form>
      </div>
    </>
  );
}
