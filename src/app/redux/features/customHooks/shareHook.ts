const shareHook = async(shareUrl:string) => {
  if (navigator.share) {
    try {
        await navigator.share({
            title: "Share Spotlight",
            url: shareUrl,
          });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  } else {
    alert("Web Share API not supported");
  }
};

export default shareHook;