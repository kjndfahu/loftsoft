import { CrossLogo } from "@/shared/icons";
import { FC, FormEvent } from "react";
import {sendAdminResponseEmail} from "@/enteties/soft-requests/send-admin-response";

interface Props {
    setIsOpen: (a: boolean) => void;
    email: string;
    requestId: string;
}

export const RequestAnswer: FC<Props> = ({ setIsOpen, email, requestId }) => {
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.append("email", email);
        formData.append("requestId", requestId);

        const result = await sendAdminResponseEmail({}, formData);

        if (result.success) {
            alert("Response sent successfully!");
            setIsOpen(false);
        } else {
            alert(result.errors?._errors || "Failed to send response.");
        }
    };

    return (
        <div onClick={e => e.stopPropagation()} className="flex flex-col items-center justify-center gap-7 w-[500px] py-10 px-6 bg-white rounded-[16px]">
            <div className="flex items-center w-full justify-between">
                <h3 className="text-[22px] font-bold text-[#161616]">Ответ на заявку #{requestId}</h3>
                <div onClick={() => setIsOpen(false)}>
                    <CrossLogo className="w-6 h-6 cursor-pointer" />
                </div>
            </div>
            <form onSubmit={handleSubmit} className="w-full">
                <div className="px-[15px] w-full py-[10px] border-[1px] border-[#B9BCCB] rounded-[10px]">
                    <textarea
                        name="response"
                        className="bg-transparent w-full h-[200px] outline-0 text-[#161616]"
                        placeholder="Напишите ответ"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-[10px] hover:bg-blue-600"
                >
                    Send Response
                </button>
            </form>
        </div>
    );
};