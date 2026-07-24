import * as LiveLike from "@livelike/widget-elements";
import { useEffect, useState } from "react";

export default function WtaPage() {
  const [loadWidgets, setLoadWidgets] = useState(false);

  const loadLiveLikeSdk = async () => {
    await LiveLike.LiveLikeInit({
      clientId: "9MxRnhmq0Wkv89ESZciLBNY8ttjKce3VkSj8Te4G",
    });
  };

  useEffect(() => {
    loadLiveLikeSdk().then(() => {
      setLoadWidgets(true);
    });
  }, []);

  return loadWidgets ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        gap: "15px",
      }}
    >
      <image-poll widgetid="ba30019b-c61f-40f7-9ec4-3c7618580290"></image-poll>
      <image-quiz widgetid="2f8f77c8-00cd-4223-abf2-efd501689868"></image-quiz>
      <image-prediction widgetid="920d5eb4-6acd-46e5-99c8-6908f0ede2e4"></image-prediction>
      <text-poll widgetid="76ecda85-59ed-4281-9645-83a1bbf87e49"></text-poll>
      <image-poll widgetid="8c44ce0c-41bd-405c-bd14-1411366e9442"></image-poll>
      {/* text-poll */}
      <text-poll widgetid="fcc2f850-3e82-4579-83cd-154311868879"></text-poll>
      <text-poll widgetid="c45fb515-c26e-4571-8b44-b86826af1845"></text-poll>

      {/* image-poll */}
      <image-poll widgetid="ba30019b-c61f-40f7-9ec4-3c7618580290"></image-poll>
      <image-poll widgetid="19a68d03-d864-4943-888d-59f46341aaee"></image-poll>

      {/* text-prediction */}
      <text-prediction widgetid="4c713672-f7bb-45a6-81ec-8a6a5deca1eb"></text-prediction>
      <text-prediction widgetid="fdab59dd-07a5-4633-a55e-29b609511e2b"></text-prediction>

      {/* image-prediction */}

      <image-prediction widgetid="d38cf48f-a8a5-40e0-853b-ad0801a0f572"></image-prediction>

      {/* text-quiz */}
      <text-quiz widgetid="6b898a94-90a1-40cb-92c5-73fc85a317e7"></text-quiz>
      <text-quiz widgetid="9d6c7f6c-e2e8-47c0-b109-1d251cb35f5c"></text-quiz>

      {/* image-quiz */}

      <image-quiz widgetid="b5a9cf26-1b2d-4b70-876b-ec6f74986b65"></image-quiz>
    </div>
  ) : (
    <p>Loading...</p>
  );
}
