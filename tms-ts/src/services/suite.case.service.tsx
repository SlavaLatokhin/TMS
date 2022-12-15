import axiosTMS from "./axiosTMS";
import {myCase} from "../components/testcases/suites.component";

export default class SuiteCaseService {

    static getSuites() {
        return axiosTMS.get("api/v1/suites/")
    }

    static getCases() {
        return axiosTMS.get("api/v1/cases/")
    }

    static getTreeSuites() {
        return axiosTMS.get("api/v1/suites/?treeview=true")
    }

    static async deleteCases(idCases: number[]) {
        for (let i = 0; i < idCases.length; i++) {
            await this.deleteCase(idCases[i]).catch((err) => console.log(err))
        }
    }

    static deleteCase(idCase: number) {
        return axiosTMS.delete("api/v1/cases/" + idCase + "/")
    }

    static deleteSuite(idSuite: number) {
        return axiosTMS.delete("api/v1/suites/" + idSuite + "/")
    }

    static createCase(myCase: { name: string; project: number; suite: number; scenario: string; }) {
        return axiosTMS.post("api/v1/cases/", myCase)
    }

    static editCase(myCase: myCase) {
        return axiosTMS.put("api/v1/cases/" + myCase.id + "/", myCase)
    }

    static createSuite(suite: { parent: number | null; name: string }) {
        return axiosTMS.post("api/v1/suites/", suite)
    }
}
