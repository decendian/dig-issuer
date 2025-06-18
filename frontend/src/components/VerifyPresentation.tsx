const [presentationRequest, setPresentationRequest] = useState(null);
const [presentation, setPresentation] = useState(null);

/**
 * Verifies a presentation (verifier side)
 */
const verifyPresentation = async () => {
    try {
        if (!presentation || !presentationRequest) {
            alert('Please create both a presentation request and a presentation first');
            return;
        }

        // const requestVerifyPresentation = new HttpClient(VERIFY_PRESENTATION_URL)
        // const response = await requestVerifyPresentation.post(
        //     {
        //         original_request: presentationRequest,
        //         presentation_response: presentation
        //     }
        // )

        const result = {}
        // setVerificationResult(response);

        if (result.is_valid) {
            alert('Presentation verified successfully!');
        } else {
            alert('Presentation verification failed');
        }

    } catch (error) {
        console.error("Error verifying presentation:", error);
    }
};


