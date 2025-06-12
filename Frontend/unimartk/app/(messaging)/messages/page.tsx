import { Message } from "@/modules/products/types";
import MessagingView from "@/modules/messaging/ui/views/messaging-view";

interface Props {
  params: Promise<{
    senderId: string;
    receiverId: string;
  }>;
}

const MessagingPage = async ({ params }: Props) => {
  return (
    <div className="h-[80vh] ">
      <MessagingView />
    </div>
  );
};

export default MessagingPage;
