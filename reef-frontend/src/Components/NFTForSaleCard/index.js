import { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { getJSONfromHash } from "../../config/axios";
import ExplorePageContext from "../../Context/ExplorePageContext";
import Web3Context from "../../Context/Web3Context";

const NFTForSaleCard = (props) => {
    const { metaData = {}, tokenId, nftContract, price, royalty, creator, } = props
    const { selectedNFTtoBuy, setSelectedNFTtoBuy } = useContext(ExplorePageContext);
    const history = useHistory()
    const { tokenURI } = useContext(Web3Context);
    const [currentMetaData, setCurrentMetaData] = useState({});
    const [nftData, setNftData] = useState();
    useEffect(() => {
        const fetchMetaData = async () => {
            const nftData = {
                ...props
            }
            nftData["tokenURI"] = await tokenURI(tokenId, nftContract);
            nftData["metaData"] = (await getJSONfromHash(nftData.tokenURI)).data;
            setNftData(nftData);
            setCurrentMetaData(nftData.metaData);
        }
        fetchMetaData();

    }, [tokenId]);
    const handleClick = () => {
        console.log('ehdfsa');
        setSelectedNFTtoBuy(nftData);
        history.push("/explore/detail");
    }

    return (<div class="w-96  bg-white rounded-lg shadow-lg overflow-hidden flex flex-col ">
        <div>
            <img class="object-center object-cover h-64 w-full" src={currentMetaData?.image?.length > 0 ? `https://ipfs.infura.io/ipfs/${currentMetaData?.image}` : "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80" || metaData?.image?.length > 0 ? `https://ipfs.infura.io/ipfs/${metaData?.image}` : metaData?.file instanceof File ? URL.createObjectURL(metaData?.file) : "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80"} alt="photo" />
        </div >
        <div onClick={handleClick} class="h-32 text-center py-8 sm:py-6">
            <p class="text-xl text-gray-700 font-bold mb-2">{currentMetaData?.title || metaData?.title}</p>
            <p class="text-base text-gray-400 font-normal">{currentMetaData?.subtitle || metaData?.subtitle}</p>
            <p class="text-base text-gray-400 font-normal">{price.toString()}</p>
            <p class="text-base text-gray-400 font-normal">{royalty?.toString()}</p>
        </div>
    </div >);
}
export default NFTForSaleCard