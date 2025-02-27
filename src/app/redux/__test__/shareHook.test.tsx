import shareHook from "../customHooks/shareHook";

describe("shareHook", () => {
  const mockShare = jest.fn();

  beforeAll(() => {
    // Mock navigator.share if supported
    Object.defineProperty(navigator, "share", {
      writable: true,
      value: mockShare,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call navigator.share with the correct parameters", async () => {
    mockShare.mockResolvedValueOnce(undefined); // Simulating successful share

    const shareUrl = "https://example.com";
    await shareHook(shareUrl);

    expect(mockShare).toHaveBeenCalledWith({
      title: "Share Spotlight",
      url: shareUrl,
    });
    expect(mockShare).toHaveBeenCalledTimes(1);
  });

  it("should handle sharing failure gracefully", async () => {
    mockShare.mockRejectedValueOnce(new Error("Sharing failed"));

    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation();

    const shareUrl = "https://example.com";
    await shareHook(shareUrl);

    expect(consoleErrorMock).toHaveBeenCalledWith("Error sharing:", new Error("Sharing failed"));

    consoleErrorMock.mockRestore();
  });

  it("should alert when Web Share API is not supported", async () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation();

    // Remove navigator.share to simulate an unsupported environment
    Object.defineProperty(navigator, "share", {
      writable: true,
      value: undefined,
    });

    await shareHook("https://example.com");

    expect(alertMock).toHaveBeenCalledWith("Web Share API not supported");

    alertMock.mockRestore();
  });
});
