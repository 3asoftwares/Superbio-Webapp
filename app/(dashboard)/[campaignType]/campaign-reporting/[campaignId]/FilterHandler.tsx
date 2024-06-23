"use client";
import ADropdown from "@/components/ADropdown/ADropdown";
import CampaignReportingFilter from "./filter";
import { useSearchParams } from "next/navigation";
import { SearchParams } from "./layout";
import { useAppSelector } from "@/context";

interface FilterHandlerProps {
  total: number;
  shouldShowSort: boolean;
  query: any;
}

const defFilterOptions: AvailableFilters = {
  platform: [],
  internalSheetId: [],
  postType: [],
  postedAt: [],
  phase: [],
  category: [],
  subCategory: [],
};

export default function FilterHandler({
  total,
  shouldShowSort,
  query
}: FilterHandlerProps) {
  const searchParams = useSearchParams();
  const { filters } = useAppSelector((state) => state.campaign);
  const data = new CampaignReportingFilter(filters);
  const filtersOptions = data.getAvailableFilters();
  const openFilter =
    searchParams.get("openFilter") && searchParams.get("openFilter") === "true";
  const sort = query.sortBy;
  const order = query.sortOrder;

  const setOpenFilter = (open: boolean) => {
    document.getElementById("filterPanel")?.classList.toggle("hidden");
  };

  const setCampFilters = (filters: { sortBy: string; sortOrder: number }) => {
    const url = new URL(window.location.href);
    url.searchParams.set("sort", filters.sortBy);
    url.searchParams.set("order", filters.sortOrder.toString());
    window.location.href = url.href;
  };

  return (
    total > 0 && (
      <span className="flex gap-4">
        {filtersOptions &&
          Object.keys(filtersOptions).length > 0 &&
          JSON.stringify(filtersOptions) !==
            JSON.stringify(defFilterOptions) && (
            <span className="flex items-center justify-end text-sm gap-2 h-12">
              <span
                className={`flex items-center gap-2 text-base font-semibold cursor-pointer ${
                  openFilter ? "text-black" : "text-[#959595]"
                }`}
                onClick={() => setOpenFilter(!openFilter)}
              >
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                  fill={openFilter ? "#000" : "#959595"}
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <title>filter-vertical</title>
                    <g id="Layer_2" data-name="Layer 2">
                      <g id="invisible_box" data-name="invisible box">
                        <rect width="48" height="48" fill="none"></rect>
                      </g>
                      <g id="icons_Q2" data-name="icons Q2">
                        <path d="M8,6.2V26.3A6.2,6.2,0,0,0,4,32a6,6,0,0,0,4,5.6v4.2A2.1,2.1,0,0,0,10,44a2.1,2.1,0,0,0,2-2.2V37.6A6,6,0,0,0,16,32a6.2,6.2,0,0,0-4-5.7V6.2A2.1,2.1,0,0,0,10,4,2.1,2.1,0,0,0,8,6.2ZM12,32a2,2,0,1,1-2-2A2,2,0,0,1,12,32Z"></path>{" "}
                        <path d="M22,6.2v4.1A6.2,6.2,0,0,0,18,16a6,6,0,0,0,4,5.6V41.8a2,2,0,1,0,4,0V21.6A6,6,0,0,0,30,16a6.2,6.2,0,0,0-4-5.7V6.2a2,2,0,1,0-4,0ZM26,16a2,2,0,1,1-2-2A2,2,0,0,1,26,16Z"></path>{" "}
                        <path d="M36,6.2V23.3A6.2,6.2,0,0,0,32,29a6,6,0,0,0,4,5.6v7.2a2,2,0,1,0,4,0V34.6A6,6,0,0,0,44,29a6.2,6.2,0,0,0-4-5.7V6.2a2,2,0,1,0-4,0ZM40,29a2,2,0,1,1-2-2A2,2,0,0,1,40,29Z"></path>{" "}
                      </g>
                    </g>
                  </g>
                </svg>
                Filter by
              </span>
            </span>
          )}
        {shouldShowSort && (
          <ADropdown
            width={"w-60"}
            position="down"
            options={[
                {
                    title: "Likes: Descending",
                    action: () =>
                      setCampFilters({ sortBy: "analytics.likes", sortOrder: -1 }),
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        id="like"
                        width="20"
                        height="20"
                        fill="#959595"
                      >
                        <path
                          fill="#959595"
                          d="M0,1v8c0,0.552246 0.447693,1 1,1h3v-10h-3c-0.552307,8.88178e-16 -1,0.447693 -1,1Z"
                          transform="translate(0 5)"
                        ></path>
                        <path
                          fill="#959595"
                          d="M9.15332,5.02979h-2.9541c-0.258301,0 -0.387695,-0.172363 -0.431152,-0.246582c-0.043457,-0.0737305 -0.131348,-0.270508 -0.0063477,-0.496094l1.0415,-1.87549c0.228516,-0.410645 0.251953,-0.893555 0.0649414,-1.32471c-0.187012,-0.43164 -0.556152,-0.744629 -1.0127,-0.858398l-0.734375,-0.183594c-0.178711,-0.0449219 -0.368164,0.0122071 -0.492676,0.150391l-3.9873,4.42969c-0.413574,0.460449 -0.641113,1.0542 -0.641113,1.67236v5.23242c0,1.37842 1.12158,2.5 2.5,2.5l4.97412,-0.0004883c1.12305,0 2.11475,-0.756348 2.41113,-1.83887l1.06738,-4.89844c0.03125,-0.13623 0.0473633,-0.275879 0.0473633,-0.415527c0,-1.01807 -0.828613,-1.84668 -1.84668,-1.84668Z"
                          transform="translate(5 .97)"
                        ></path>
                      </svg>
                    ),
                  },
              {
                title: "Likes: Ascending",
                action: () =>
                  setCampFilters({ sortBy: "analytics.likes", sortOrder: 1 }),
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    id="like"
                    width="20"
                    height="20"
                    fill="#959595"
                  >
                    <path
                      fill="#959595"
                      d="M0,1v8c0,0.552246 0.447693,1 1,1h3v-10h-3c-0.552307,8.88178e-16 -1,0.447693 -1,1Z"
                      transform="translate(0 5)"
                    ></path>
                    <path
                      fill="#959595"
                      d="M9.15332,5.02979h-2.9541c-0.258301,0 -0.387695,-0.172363 -0.431152,-0.246582c-0.043457,-0.0737305 -0.131348,-0.270508 -0.0063477,-0.496094l1.0415,-1.87549c0.228516,-0.410645 0.251953,-0.893555 0.0649414,-1.32471c-0.187012,-0.43164 -0.556152,-0.744629 -1.0127,-0.858398l-0.734375,-0.183594c-0.178711,-0.0449219 -0.368164,0.0122071 -0.492676,0.150391l-3.9873,4.42969c-0.413574,0.460449 -0.641113,1.0542 -0.641113,1.67236v5.23242c0,1.37842 1.12158,2.5 2.5,2.5l4.97412,-0.0004883c1.12305,0 2.11475,-0.756348 2.41113,-1.83887l1.06738,-4.89844c0.03125,-0.13623 0.0473633,-0.275879 0.0473633,-0.415527c0,-1.01807 -0.828613,-1.84668 -1.84668,-1.84668Z"
                      transform="translate(5 .97)"
                    ></path>
                  </svg>
                ),
              },
              {
                title: "Posted Time: Ascending",
                action: () =>
                  setCampFilters({ sortBy: "postedAt", sortOrder: 1 }),
                icon: (
                  <svg
                    width="20px"
                    height="20px"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#959595"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <g id="Layer_2" data-name="Layer 2">
                        <g id="invisible_box" data-name="invisible box">
                          <rect width="48" height="48" fill="none"></rect>
                        </g>
                        <g id="icons_Q2" data-name="icons Q2">
                          <path d="M24,2A22,22,0,1,0,46,24,21.9,21.9,0,0,0,24,2ZM35.7,31A2.1,2.1,0,0,1,34,32a1.9,1.9,0,0,1-1-.3L22,25.1V14a2,2,0,0,1,4,0v8.9l9,5.4A1.9,1.9,0,0,1,35.7,31Z"></path>{" "}
                        </g>
                      </g>
                    </g>
                  </svg>
                ),
              },
              {
                title: "Posted Time: Descending",
                action: () =>
                  setCampFilters({ sortBy: "postedAt", sortOrder: -1 }),
                icon: (
                  <svg
                    width="20px"
                    height="20px"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#959595"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <g id="Layer_2" data-name="Layer 2">
                        <g id="invisible_box" data-name="invisible box">
                          <rect width="48" height="48" fill="none"></rect>
                        </g>
                        <g id="icons_Q2" data-name="icons Q2">
                          <path d="M24,2A22,22,0,1,0,46,24,21.9,21.9,0,0,0,24,2ZM35.7,31A2.1,2.1,0,0,1,34,32a1.9,1.9,0,0,1-1-.3L22,25.1V14a2,2,0,0,1,4,0v8.9l9,5.4A1.9,1.9,0,0,1,35.7,31Z"></path>{" "}
                        </g>
                      </g>
                    </g>
                  </svg>
                ),
              },
            ]}
            header={
              <div
                className="flex h-12 w-auto items-center justify-center gap-2 rounded-lg cursor-pointer text-sm text-[#9A9AB0] font-semibold"
                onClick={() =>
                  document
                    .getElementById("date-dropdown")
                    ?.classList.toggle("hidden")
                }
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#7D7D7D"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 7H21"
                    stroke="#7D7D7D"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6 12H18"
                    stroke="#7D7D7D"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 17H14"
                    stroke="#7D7D7D"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="capitalize text-[#959595]">Sort By:</span>
                <span className="flex items-center gap-1 w-auto min-w-120 bg-[#e6e6e6] text-[#959595] rounded-lg py-1 px-3 h-9">
                  {sort === "postedAt" ? (
                    <>
                      <svg
                        width="16px"
                        height="16px"
                        viewBox="0 0 48 48"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#959595"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <g id="Layer_2" data-name="Layer 2">
                            <g id="invisible_box" data-name="invisible box">
                              <rect width="48" height="48" fill="none"></rect>
                            </g>
                            <g id="icons_Q2" data-name="icons Q2">
                              <path d="M24,2A22,22,0,1,0,46,24,21.9,21.9,0,0,0,24,2ZM35.7,31A2.1,2.1,0,0,1,34,32a1.9,1.9,0,0,1-1-.3L22,25.1V14a2,2,0,0,1,4,0v8.9l9,5.4A1.9,1.9,0,0,1,35.7,31Z"></path>{" "}
                            </g>
                          </g>
                        </g>
                      </svg>
                      Posted Time:{" "}
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        id="like"
                        width="16"
                        height="16"
                        fill="#959595"
                      >
                        <path
                          fill="#959595"
                          d="M0,1v8c0,0.552246 0.447693,1 1,1h3v-10h-3c-0.552307,8.88178e-16 -1,0.447693 -1,1Z"
                          transform="translate(0 5)"
                        ></path>
                        <path
                          fill="#959595"
                          d="M9.15332,5.02979h-2.9541c-0.258301,0 -0.387695,-0.172363 -0.431152,-0.246582c-0.043457,-0.0737305 -0.131348,-0.270508 -0.0063477,-0.496094l1.0415,-1.87549c0.228516,-0.410645 0.251953,-0.893555 0.0649414,-1.32471c-0.187012,-0.43164 -0.556152,-0.744629 -1.0127,-0.858398l-0.734375,-0.183594c-0.178711,-0.0449219 -0.368164,0.0122071 -0.492676,0.150391l-3.9873,4.42969c-0.413574,0.460449 -0.641113,1.0542 -0.641113,1.67236v5.23242c0,1.37842 1.12158,2.5 2.5,2.5l4.97412,-0.0004883c1.12305,0 2.11475,-0.756348 2.41113,-1.83887l1.06738,-4.89844c0.03125,-0.13623 0.0473633,-0.275879 0.0473633,-0.415527c0,-1.01807 -0.828613,-1.84668 -1.84668,-1.84668Z"
                          transform="translate(5 .97)"
                        ></path>
                      </svg>
                      Likes:{" "}
                    </>
                  )}
                  {Number(order) === -1 ? (
                    <span className="flex items-center gap-1">
                      Descending
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="#959595"
                        viewBox="0 0 24 24"
                        id="round-arrow-down"
                      >
                        <path
                          fill="#959595"
                          fillRule="evenodd"
                          d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12ZM15.5303 12.4697C15.8232 12.7626 15.8232 13.2374 15.5303 13.5303L12.5303 16.5303C12.2374 16.8232 11.7626 16.8232 11.4697 16.5303L8.46967 13.5303C8.17678 13.2374 8.17678 12.7626 8.46967 12.4697C8.76256 12.1768 9.23744 12.1768 9.53033 12.4697L11.25 14.1893V8C11.25 7.58579 11.5858 7.25 12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V14.1893L14.4697 12.4697C14.7626 12.1768 15.2374 12.1768 15.5303 12.4697Z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      Ascending
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="#959595"
                        viewBox="0 0 24 24"
                        id="round-arrow-up"
                      >
                        <path
                          fill="#959595"
                          fillRule="evenodd"
                          d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12ZM8.46967 11.5303C8.17678 11.2374 8.17678 10.7626 8.46967 10.4697L11.4697 7.46967C11.7626 7.17678 12.2374 7.17678 12.5303 7.46967L15.5303 10.4697C15.8232 10.7626 15.8232 11.2374 15.5303 11.5303C15.2374 11.8232 14.7626 11.8232 14.4697 11.5303L12.75 9.81066V16C12.75 16.4142 12.4142 16.75 12 16.75C11.5858 16.75 11.25 16.4142 11.25 16V9.81066L9.53033 11.5303C9.23744 11.8232 8.76256 11.8232 8.46967 11.5303Z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </span>
                  )}
                </span>
              </div>
            }
          />
        )}
      </span>
    )
  );
}
