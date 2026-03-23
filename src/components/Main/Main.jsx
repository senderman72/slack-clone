import { useParams } from "react-router-dom";
import ChatView from "./ChatView";

export default function Main() {
  const { id } = useParams();
  return <ChatView collectionPath={`channels/${id}/messages`} />;
}
