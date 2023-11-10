import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button, Divider, Input, Select, SelectItem } from "@nextui-org/react";
import { Down } from "@icon-park/react";


export default function SwapCard() {

    const animals = [
        { label: "USDC", value: "USDC", description: "The second most popular pet in the world" },
        { label: "BNB", value: "BNB", description: "The most popular pet in the world" },
        { label: "ETH", value: "ETH", description: "The largest land animal" },
    ];

    return (
        <div className="flex flex-col items-center justify-center mx-5">

            <Card
                className="w-full mt-5 sm:mt-20 md:w-[50%] lg:w-[50%] justify-center"
            >
                <CardHeader>
                    Swap
                </CardHeader>
                <Divider/>
                <CardBody>
                    <div className="flex flex-row  items-center justify-center space-x-4">
                        <Select
                            color="primary"
                            label="Select Token"
                            placeholder="Select an animal"
                            defaultSelectedKeys={["USDC"]}
                            size="lg"
                            radius="full"
                        >
                            {animals.map((animal) => (
                                <SelectItem key={animal.value} value={animal.value}>
                                    {animal.label}
                                </SelectItem>
                            ))}
                        </Select>
                        <Select
                            color="warning"
                            label="Select Token"
                            placeholder="Select an animal"
                            defaultSelectedKeys={["USDC"]}
                            size="lg"
                            radius="full"
                        >
                            {animals.map((animal) => (
                                <SelectItem key={animal.value} value={animal.value}>
                                    {animal.label}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                    <div className="mt-5">
                        <Input size="lg" label="You Pay"/>
                        <div className="flex w-full flex-col items-center mt-2.5 mb-2.5">
                            <Down theme="multi-color" size="30" fill={['#333', '#2F88FF', '#FFF', '#43CCF8']}
                                  strokeWidth={2} strokeLinecap="square"/>
                        </div>
                        <Input size="lg" label="You Receive"/>
                    </div>
                </CardBody>
                <div className="flex flex-col mx-5 mb-5">
                    <Button color="primary" size="lg">
                        Primary
                    </Button>
                </div>
            </Card>
        </div>
    )
}