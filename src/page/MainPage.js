import LeftSideBar from "src/layouts/MainLayout/LeftSide/left-side-bar";
import ServerSideBar from "src/layouts/MainLayout/LeftSide/server-side-bar";
import Chat from "../layouts/MainLayout/chat/Chat";

function MainPage() {
    return (
        <>
            <div className="flex h-full bg-[#0b1725]">
                <LeftSideBar />
                <ServerSideBar />
                <Chat />
            </div>
        </>
    );
}

export default MainPage;
