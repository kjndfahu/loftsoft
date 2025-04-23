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
        <div className="flex items-center pt-6 gap-6">
            {data.map((item) => (
                <div
                    key={item.id}
                    className="flex flex-col w-[200px] h-[123px] border-[1px] border-[#DBDEEF] rounded-[16px] items-center py-6 justify-between">
                    {item.img}
                    <h5 className="text-[16px] font-medium text-[#161616]">{item.title}</h5>
                </div>
            ))}
        </div>
    )
}