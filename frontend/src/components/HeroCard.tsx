import { useSelector } from "react-redux";
import TrainNowButton from "./buttons/TrainNowButton";
import { RootState } from "../store/store";

const HeroCard = () => {

  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn); // Check if the user is logged in

  return (
    <div className=" rounded-2xl  md:w-4/5 lg:w-3/5 xl:w-2/5 mx-auto ">
      <div className="flex justify-between bg-bpegrey m-3 rounded-2xl">
        <div className="flex-col space-y-5  w-full p-8">
          <h1 className="text-4xl font-inter font-medium text-white">
            <span className="text-bpegreen">BPE</span> Tokenization
          </h1>
          <p className="text-white text-md font-inter font-light pb-4">
            BPE (Byte Pair Encoding) tokenization is a method used in natural
            language processing (NLP) to break down text into subword units,
            rather than just words or characters. <br /> <br /> This approach is
            particularly effective for handling rare words, reducing vocabulary
            size, and improving the efficiency of language models.
          </p>
          <h1 className="text-3xl font-inter font-medium text-white pt-2">
            Train your own <span className="text-bpegreen">BPE </span> tokenizer
          </h1>
          <p className="text-white text-md font-inter font-light pb-4">
            This website provides the ability to train and save your own BPE
            tokenizer with various parameters and using any training corpus.
            <br />
            <br />
            Then with your own trained tokenizer you can tokenize any corpus you
            want, see the statistics of your tokenizer and view the tokenized
            version of your corpus!
          </p>
          {!loggedIn && ( // Show the use default prompt if the user is not logged in, else show the training prompt
            <p className="text-white text-md font-inter font-light pb-4"><span className="font-medium text-bpegreen">Ready to tokenize?</span> Log in now to train and test your own models. New to tokenization? No problem! Experiment with our pre-trained defaults.</p>
          )}
          <TrainNowButton />
        </div>
      </div>
    </div>
  );
};

export default HeroCard;
