import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import { AcmeLogo } from "@/components/AcmeLogo";
import ConnectButton from "@/pages/components/ConnectButton";

export default function IndexFrame() {
    return (
        <Navbar isBordered>
            <NavbarBrand>
                <AcmeLogo/>
                <p className="font-bold text-inherit">Circle Swap</p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex" justify="start">
                <NavbarItem isActive>
                    <Link href="#" aria-current="page" color={"foreground"}>
                        Intra-chain Swap
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href="#" aria-current="page" color={"foreground"}>
                        Cross-chain Swap
                    </Link>
                </NavbarItem>
                {/*<NavbarItem>*/}
                {/*    <Link color="foreground" href="#">*/}
                {/*        Integrations*/}
                {/*    </Link>*/}
                {/*</NavbarItem>*/}
            </NavbarContent>
            <NavbarContent justify="end">
                {/*<NavbarItem className="hidden lg:flex">*/}
                {/*    <Link href="#">Login</Link>*/}
                {/*</NavbarItem>*/}
                <NavbarItem>
                    <ConnectButton/>
                </NavbarItem>
                {/*<NavbarItem>*/}
                {/*    <Button onClick={() => switchNetwork(137)}>*/}
                {/*        switch*/}
                {/*    </Button>*/}
                {/*</NavbarItem>*/}
                {/*<NavbarItem>*/}
                {/*    <SwitchNetwork/>*/}
                {/*</NavbarItem>*/}
            </NavbarContent>
        </Navbar>
    );
}
