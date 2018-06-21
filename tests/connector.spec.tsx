import chai, { assert, expect, use } from "chai";
import { mount, ReactWrapper, shallow } from "enzyme";
import "mocha";
import * as React from "react";

import { connect, StoreProvider } from "../src";
import { Store, StoreSchema, Path } from "../node_modules/reistore";

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
    function Component(props: IProps) {
        return <div>{props.a}{props.b}{props.c}</div>;
    }
    const ConnectedComponent = connect<IStore, IStore, IProps, IStore>(
        schema,
        ({ a, b }, props) => ({ a, b }),
        Component
    );
    beforeEach(() => {
        wrapper = mount(
            <StoreProvider value={store}>
                <ConnectedComponent c="sd" />
            </StoreProvider>
        );
    });

    it("correct render", () => {
        const result = wrapper.find("Component").props() as any as IProps;

        expect(result.a).to.be.equal(5);
        expect(result.b).to.be.equal(7);
        expect(result.c).to.be.equal("sd");
    });
    it("correct update", () => {
        store.instructor.set(Path.fromSelector(f => f.a), 10);
        const result = wrapper.update().find("Component").props() as any as IProps;

        expect(result.a).to.be.equal(10);
        expect(result.b).to.be.equal(7);
        expect(result.c).to.be.equal("sd");
    });
});
