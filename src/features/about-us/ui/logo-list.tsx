import {AutodeskLogo, CreativeCloudLogo, FigmaLogo, MicrosoftOffice, RGBLogo, WindowsLogo} from "@/shared/icons";

export const LogoList = () => {
    const data = [
        {
            id: 1,
            img: <MicrosoftOffice/>,
            title: 'Microsoft Office'
        },
        {
            id: 2,
            img: <AutodeskLogo/>,
            title: 'Autodesk'
        },
        {
            id: 3,
            img: <WindowsLogo/>,
            title: 'Windows'
        },
        {
            id: 4,
            img: <CreativeCloudLogo/>,
            title: 'Creative Cloud'
        },
        {
            id: 5,
            img: <FigmaLogo/>,
            title: 'Figma'
        },
        {
            id: 6,
            img: <RGBLogo/>,
            title: 'Creative Cloud'
        },
    ]
    return (
        <div className="flex z-[3] items-center pt-6 sml:gap-6 gap-3">
            {data.map((item) => (
                <div
                    key={item.id}
                    className="flex flex-col sml:w-[200px] w-[130px] bg-white sml:h-[123px] h-[75px] border-[1px] border-[#DBDEEF] sml:rounded-[16px] rounded-[12px] items-center sml:py-6 py-3 justify-between">
                    {item.img}
                    <h5 className="sml:text-[16px] text-[14px] font-medium text-[#161616]">{item.title}</h5>
                </div>
            ))}
        </div>
    )
}