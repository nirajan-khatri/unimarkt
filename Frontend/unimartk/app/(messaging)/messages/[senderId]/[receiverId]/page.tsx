import { Message } from "@/modules/products/types";
import MessagingView from "@/modules/messaging/ui/views/messaging-view";

interface Props {
  params: Promise<{
    senderId: string;
    receiverId: string;
  }>;
}

const MessagingPage = async ({ params }: Props) => {
  const { receiverId, senderId } = await params;

  return (
    <div className="h-[80vh] ">
      <MessagingView senderId={senderId} receiverId={receiverId} />
    </div>
  );
};

export default MessagingPage;
