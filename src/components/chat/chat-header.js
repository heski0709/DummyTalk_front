import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import {useEffect, useState} from "react";
import {useUrlQuery} from "src/components/hooks/use-url-query";

const ChatHeader = ({ isOpen, setOpen }) => {

    const [ channelName, setChannelName ] = useState("");
    const query = useUrlQuery();
    const channelId = query.get("channel");

    const getChannelName = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/channel/${channelId}`
            );
            console.log(`채널 이름 조회 성공:`, response.data);
            setChannelName(response.data.channelName);
        } catch (error) {
            console.error(`채널 이름 조회 실패: ${error}`);
        }
    }
    console.log("채널 아이디  : ", channelName);

    useEffect(() => {
        getChannelName();
    }, [channelId]);

    return channelName && (
        <div className="h-[50px] font-bold text-xl flex pl-5 items-center bg-[#D9D9D9] border-y-[1px] border-black justify-between">
            <div>{channelName}</div>
            {/* 우측 사이드 닫힘 / 열림 */}
            <Button
                variant={"icon"}
                onClick={() => setOpen((prev) => !prev)}
            >
                {isOpen ? <ChevronsRight /> : <ChevronsLeft />}
            </Button>
        </div>
    );
};
export default ChatHeader;
