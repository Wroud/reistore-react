import { expect } from "chai";
import { mount, ReactWrapper } from "enzyme";
import "mocha";
import * as React from "react";

import { connect, StoreProvider } from "../src";
import { Store, StoreSchema, Path } from "reistore";

describe("Connector", () => {
    let wrapper: ReactWrapper<any, any>;
    interface IRes {
        c: string
    }
    interface IStore {
        a: number,
        b: number,
    }
    const schema = new StoreSchema();
    const store = new Store<IStore>(schema, { a: 5, b: 7 });
    interface IProps {
        a: number,
        b: number,
        c: string
    }
    function myComponent(props: IProps) {
        return <div>{props.a}{props.b}{props.c}{props.children}</div>;
    }
    const ConnectedComponent = connect<IStore, IStore, IProps, IStore>(schema)(myComponent);
    beforeEach(() => {
        wrapper = mount(
            <div>
                <StoreProvider value={store}>
                    <ConnectedComponent c="sd">
                        <ConnectedComponent c="tt" />
                    </ConnectedComponent>
                </StoreProvider>
            </div>
        );
    });

    it("correct render", () => {
        const result = wrapper.find("myComponent").first().props() as any as IProps;

        expect(result.a).to.be.equal(5);
        expect(result.b).to.be.equal(7);
        expect(result.c).to.be.equal("sd");
    });
    it("correct update", () => {
        store.instructor.set(Path.fromSelector(f => f.a), 10);
        const result = wrapper.update().find("myComponent").first().props() as any as IProps;

        expect(result.a).to.be.equal(10);
        expect(result.b).to.be.equal(7);
        expect(result.c).to.be.equal("sd");
    });
});
