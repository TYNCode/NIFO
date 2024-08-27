const shareHook = async(shareUrl:string) => {
    console.log("shareURL--->",shareUrl)
    if (navigator.share) {
      try {
          await navigator.share({
              title: "Share Spotlight",
              url: shareUrl,
            });
            console.log("Successfully shared");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Web Share API not supported");
    }
  };
  
  export default shareHook;