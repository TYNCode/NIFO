import Image from "next/image";

export const StartupDetails = ({ startup }) => (
  <div className="p-2 ">
    {/* Startup Logo and Name */}
    <div className="flex items-center space-x-4 mb-4">
      <Image
        src={startup.startup_logo}
        alt={`${startup.startup_name} Logo`}
        className="w-16 h-16 rounded-full object-cover"
      />
      <h3 className="text-2xl font-semibold text-gray-800">
        {startup.startup_name}
      </h3>
    </div>

    {/* Startup Details */}
    <dl className="flex flex-col gap-3">
      <div>
        <dt className="font-bold text-gray-700">Website:</dt>
        <dd>
          <a
            href={`https://${startup.startup_url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {startup.startup_url}
          </a>
        </dd>
      </div>

      <div>
        <dt className="font-bold text-gray-700">Industry:</dt>
        <dd className="text-gray-700">{startup.startup_industry}</dd>
      </div>

      <div>
        <dt className="font-bold text-gray-700">Technology:</dt>
        <dd className="text-gray-700">{startup.startup_technology}</dd>
      </div>

      <div>
        <dt className="font-bold text-gray-700">Company Stage:</dt>
        <dd className="text-gray-700">{startup.startup_company_stage}</dd>
      </div>

      <div>
        <dt className="font-bold text-gray-700">Country:</dt>
        <dd className="text-gray-700">{startup.startup_country}</dd>
      </div>

      <div>
        <dt className="font-bold text-gray-700">Founder(s):</dt>
        <dd className="text-gray-700">{startup.startup_founders_info}</dd>
      </div>

      <div>
        <dt className="font-bold text-gray-700">Email:</dt>
        <dd>
          <a
            href={`mailto:${startup.startup_emails}`}
            className="text-blue-500 hover:underline"
          >
            {startup.startup_emails}
          </a>
        </dd>
      </div>

      <div className="">
        <dt className="font-bold text-gray-700">Use Cases:</dt>
        <dd className="text-gray-700">{startup.startup_usecases}</dd>
      </div>

      <div className="">
        <dt className="font-bold text-gray-700">Solutions:</dt>
        <dd className="text-gray-700">{startup.startup_solutions}</dd>
      </div>

      <div className="">
        <dt className="font-bold text-gray-700">Overview:</dt>
        <dd className="text-gray-700">{startup.startup_overview}</dd>
      </div>

      <div className="">
        <dt className="font-bold text-gray-700">Description:</dt>
        <dd className="text-gray-700">{startup.startup_description}</dd>
      </div>
    </dl>
  </div>
);
