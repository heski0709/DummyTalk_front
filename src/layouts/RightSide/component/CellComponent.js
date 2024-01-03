import React, {useEffect, useRef, useState} from "react";
import {useUrlQuery} from "src/components/hooks/use-url-query";
import axios from "axios";
import FileDownload from 'react-file-download';
import {Button} from "src/components/ui/button";
import {Search} from "lucide-react";


const CellComponent = () => {

    const query = useUrlQuery();
    const channelId = query.get("channel");
    const [searchQuery, setSearchQuery] = useState("");
    const [updateData, setUpdateData] = useState([]);
    const [data, setData] = useState('');
    const [renderImage, setRenderImage] = useState(null);
    const topRef = useRef()
    // console.log("updateData", updateData)

    const imageListRequest = async (channelId) => {

        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/img/list/${channelId}`
            );
            setData(response.data.data);

            console.log("이미지 response ", response.data);
        } catch (error) {
            console.error("이미지 리스트 뽑아보기 에러", error);
        }
    }

    useEffect(() => {

        if (!channelId) return null;
        imageListRequest(channelId);

    }, [channelId]);

    const convertBase64 = (file) => {
        const binaryString = atob(file);
        // binaryString을 ArrayBuffer로 변환
        const arrayBuffer = new ArrayBuffer(file.length);
        const uint8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < binaryString.length; i++) {
            uint8Array[i] = binaryString.charCodeAt(i);
        }

        return uint8Array;
    }

    function displayImage(img) {
        const newBlob = new Blob([convertBase64(img.fileBlob)], {type: img.contentType});
        // Blob을 img 태그로 변환하여 화면에 표시
        return URL.createObjectURL(newBlob);
    }

    const handleDownload = (img) => {
        if (img === null || !img) return null;
        FileDownload(convertBase64(img.fileBlob), img.originalFileName, img.contentType);
    };

    useEffect(() => {
        if (updateData) {
            setData(updateData);
        }
    }, [updateData, setData]);

    const imageSearchRequest = async () => {
        console.log("searchQuery", searchQuery);
        try {
            const response = await axios.get(
                `http://localhost:8000/api/search/text/${channelId}/${searchQuery}`// FastAPI 엔드포인트로 변경
            );
            console.log("Response from FastAPI: ", response);
            if (response.status === 200) {
                setUpdateData(response.data.similar_images); // 데이터 설정
                setSearchQuery(""); // 검색창 초기화
            }
        } catch (error) {
            console.error("Error in fetching data", error);
        }
    }
    const enter_event = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            imageSearchRequest();
        }
    };

    return (
        <>
            <div className="relative h-10 w-full">
                <input
                    type="text"
                    value={searchQuery}
                    onKeyDown={enter_event}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="검색어를 입력하세요."
                    className="border-2 border-gray-300 rounded-md p-2 mb-10 mx-5 w-[90%] bg-right-8 bg-center bg-no-repeat bg-contain"
                    ref={topRef}
                />
                <Button
                    className="border-none absolute right-[5%] bottom-[10%] top-[5%]"
                    onClick={imageSearchRequest}
                >
                    <Search/>
                </ Button>
            </div>
            <div className="grid grid-cols-3 gap-5">
                {data && data.map((img, index) => (
                    <div key={index} className="relative aspect-w-3 aspect-h-4"
                         onClick={(e) => handleDownload(!img.imagePath ? img : null)}>

                        <img
                            src={img.imagePath || displayImage(img)}
                            alt={`Image ${index}`}
                            className="w-full h-full object-cover object-center rounded-md"
                        />
                    </div>
                ))}
            </div>
        </>
    );
}
export default CellComponent;